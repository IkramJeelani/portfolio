#include <reg51.h>

void InitTimer0(void);
void InitPWM(void);
void InitTimer1(void);
char digit_to_seg(unsigned char d);
unsigned int rpm_from_ticks(unsigned int ticks);
void refresh_display(void);

unsigned char PWM = 0;
unsigned int temp = 0;
#define PWM_Freq_Num 257 /* PWM time scale */

#define FOSC 11059200UL
#define TICK_FREQ (FOSC / 12UL) /* timer tick freq */
/* 2 FG periods per revolution => N = 30 / Ts */
#define RPM_CONST (30UL * TICK_FREQ) /* ticks→RPM gain */

/* control tuning */
#define RPM_PER_DUTY 100 /* P gain divisor */
#define RPM_DEADBAND 20  /* ignore errors within ±20 rpm */
#define MAX_DUTY_STEP 3  /* limit duty change per measurement */

/* DIP inputs on P1.0, P1.1, P1.2 (P1.2 = MSB), active-low */
sbit DIP0 = P1 ^ 0; /* DIP bit0 */
sbit DIP1 = P1 ^ 1; /* DIP bit1 */
sbit DIP2 = P1 ^ 2; /* DIP bit2 */

/* PWM output on P2.3 */
sbit PWM_Pin = P2 ^ 3; /* fan PWM */

/* Encoder FG input on P2.4 */
sbit ENC_Pin = P2 ^ 4; /* fan tach */

/* Common-anode 7-seg codes for 0–9 on P0 */
char zero = 0x81;
char one = 0x9F;
char two = 0xA4;
char three = 0x86;
char four = 0x9A;
char five = 0xC2;
char six = 0xC0;
char seven = 0x8F;
char eight = 0x80;
char nine = 0x82;

/* DIP percentage table: level 0..7 -> 0,40,50,60,70,80,90,100 % */
unsigned char percent_table[8] = {0, 40, 50, 60, 70, 80, 90, 100};

/* digits for multiplexing (right, middle, left) */
volatile unsigned char disp_digits[3] = {0, 0, 0};

/* encoder measurement state */
unsigned int rpm_avg = 0;
unsigned int rpm_samples[3] = {0, 0, 0};
unsigned char sample_idx = 0;
bit have3 = 0;
unsigned char prev_enc = 0;
unsigned int last_ticks = 0;

/* control state: duty in 0..255 (0%..100% ON time) */
unsigned int duty = 0; /* internal duty */

/* flag: set when a new RPM measurement is available */
bit new_rpm = 0;

/* --- helper functions --- */

char digit_to_seg(unsigned char d)
{
    switch (d)
    {
    case 0:
        return zero;
    case 1:
        return one;
    case 2:
        return two;
    case 3:
        return three;
    case 4:
        return four;
    case 5:
        return five;
    case 6:
        return six;
    case 7:
        return seven;
    case 8:
        return eight;
    case 9:
        return nine;
    default:
        return zero;
    }
}

unsigned int rpm_from_ticks(unsigned int ticks)
{
    unsigned long rpm;
    if (ticks == 0)
        return 0; /* avoid divide 0 */
    rpm = RPM_CONST / (unsigned long)ticks;
    if (rpm > 65535UL)
        rpm = 65535UL; /* clamp value */
    return (unsigned int)rpm;
}

/* update one 7-seg digit */
void refresh_display(void)
{
    static unsigned char cur_digit = 0;

    P2 &= 0xF8; /* disable digits on P2.0..P2.2 */

    P0 = digit_to_seg(disp_digits[cur_digit]);

    switch (cur_digit)
    {
    case 0:
        P2 |= 0x01; /* right digit */
        break;
    case 1:
        P2 |= 0x02; /* middle digit */
        break;
    case 2:
        P2 |= 0x04; /* left digit */
        break;
    }

    cur_digit++;
    if (cur_digit >= 3)
        cur_digit = 0;
}

/* --- main --- */

void main()
{
    unsigned char level;
    unsigned char percent;
    unsigned int ref_rpm;
    int error_rpm;
    int delta_duty;

    unsigned int rpm10;
    unsigned int rpm10_base10;
    unsigned char h, t, o;

    InitPWM();    /* enable PWM */
    InitTimer1(); /* encoder timer */

    last_ticks = ((unsigned int)TH1 << 8) | TL1;
    duty = 0;
    PWM = 255; /* start fan off (0% duty in ISR) */

    while (1)
    {
        /* read DIP → percent */
        level = 0;
        if (!DIP0)
            level |= 0x01;
        if (!DIP1)
            level |= 0x02;
        if (!DIP2)
            level |= 0x04;

        percent = percent_table[level];
        ref_rpm = (unsigned int)((unsigned int)percent * 24U); /* 0..2400 */

        /* tachometer → rpm_avg */
        {
            unsigned char cur_enc = ENC_Pin;

            if (cur_enc && !prev_enc) /* rising edge */
            {
                unsigned int now = ((unsigned int)TH1 << 8) | TL1;
                unsigned int ticks = now - last_ticks;
                unsigned int rpm = rpm_from_ticks(ticks);
                unsigned long sum;

                last_ticks = now;

                rpm_samples[sample_idx] = rpm;
                sample_idx++;
                if (sample_idx >= 3)
                {
                    sample_idx = 0;
                    have3 = 1;
                }

                if (have3)
                {
                    sum = (unsigned long)rpm_samples[0] +
                          (unsigned long)rpm_samples[1] +
                          (unsigned long)rpm_samples[2];
                    rpm_avg = (unsigned int)(sum / 3UL); /* 3-pt avg */
                }
                else
                {
                    rpm_avg = rpm;
                }

                new_rpm = 1; /* flag: new measurement available */
            }

            prev_enc = cur_enc;
        }

        /* simple P control */
        if (percent == 0)
        {
            duty = 0;
            PWM = 255; /* force 0% duty */
            rpm_avg = 0;
            rpm_samples[0] = rpm_samples[1] = rpm_samples[2] = 0;
            sample_idx = 0;
            have3 = 0;
            last_ticks = ((unsigned int)TH1 << 8) | TL1;
            new_rpm = 0;
        }
        else if (new_rpm) /* only update when we have a fresh RPM sample */
        {
            new_rpm = 0; /* consume flag */

            error_rpm = (int)ref_rpm - (int)rpm_avg;

            /* deadband: ignore tiny errors to reduce hunting */
            if (error_rpm > -RPM_DEADBAND && error_rpm < RPM_DEADBAND)
            {
                error_rpm = 0;
            }

            /* proportional duty change, but limited */
            delta_duty = error_rpm / RPM_PER_DUTY;

            if (delta_duty > MAX_DUTY_STEP)
                delta_duty = MAX_DUTY_STEP;
            if (delta_duty < -MAX_DUTY_STEP)
                delta_duty = -MAX_DUTY_STEP;

            duty = (unsigned int)((int)duty + delta_duty);

            if ((int)duty < 0)
                duty = 0;
            if (duty > 255U)
                duty = 255U;

            PWM = 255U - (unsigned char)duty; /* invert for ISR (0 = max ON) */
        }

        /* RPM → 3 digits */
        rpm10 = (rpm_avg + 5U) / 10U; /* RPM/10 rounded */
        if (rpm10 > 999U)
            rpm10 = 999U;

        rpm10_base10 = rpm10 - (rpm10 % 10U); /* snap to 10s */

        h = (unsigned char)(rpm10_base10 / 100U);
        t = (unsigned char)((rpm10_base10 / 10U) % 10U);
        o = (unsigned char)(rpm10 % 10U);

        disp_digits[0] = o;
        disp_digits[1] = t;
        disp_digits[2] = h;

        refresh_display(); /* multiplex step */
    }
}

/* --- Timer0 setup for PWM --- */
void InitTimer0(void)
{
    TMOD &= 0xF0;
    TMOD |= 0x01; /* Timer0 mode1 */

    TH0 = 0x00;
    TL0 = 0x00;

    ET0 = 1; /* enable T0 IRQ */
    EA = 1;  /* global IRQ on */

    TR0 = 1; /* start Timer0 */
}

void InitPWM(void)
{
    PWM = 0;
    InitTimer0();
}

/* --- Timer1 free-running for FG --- */
void InitTimer1(void)
{
    TMOD &= 0x0F;
    TMOD |= 0x10; /* Timer1 mode1 */

    TH1 = 0x00;
    TL1 = 0x00;

    TR1 = 1; /* start Timer1 */
}

/* --- Timer0 ISR: generate PWM on P2.3 --- */
void Timer0_ISR(void) interrupt 1
{
    TR0 = 0; /* pause Timer0 */

    if (PWM_Pin)
    {
        PWM_Pin = 0;                        /* go low */
        temp = (255U - PWM) * PWM_Freq_Num; /* low interval */
        TH0 = 0xFF - ((temp >> 8) & 0xFF);
        TL0 = 0xFF - (temp & 0xFF);
    }
    else
    {
        PWM_Pin = 1;               /* go high */
        temp = PWM * PWM_Freq_Num; /* high interval */
        TH0 = 0xFF - ((temp >> 8) & 0xFF);
        TL0 = 0xFF - (temp & 0xFF);
    }

    TF0 = 0; /* clear flag */
    TR0 = 1; /* restart T0 */
}
