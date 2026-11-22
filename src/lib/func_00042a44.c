#include "game/clock420.h"
typedef unsigned long long u64;
u64 osGetTime(void);
void func_00042a44(Clock420 *c) {
    u64 s = osGetTime() / 46875000;
    c->seconds = s % 60;
    c->minutes = s / 60 % 60;
    s /= 3600;
    if (s < 100) {
        c->hours = s;
    } else {
        c->hours = 99;
        c->seconds = 59;
        c->minutes = 59;
    }
}
