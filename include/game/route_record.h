#ifndef OB64_GAME_ROUTE_RECORD_H
#define OB64_GAME_ROUTE_RECORD_H

#include "common/types.h"

/* Allocated by func_0011AECC and stored at runtime unit offset 0xA4. */
typedef struct RouteRecord {
    float *field00, *field04, *field08, *field0C, *field10;
    s32 field14;
    float field18;
    float field1C;
} RouteRecord;

void func_0011A9B8(float value, float *firstOut, float *secondOut, float *third,
    float *first, float *second, float *fourth, float *fifth, s32 count);
float func_0011AE34(RouteRecord *record);

#endif
