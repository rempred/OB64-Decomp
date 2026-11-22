#ifndef OB64_COMMON_MUS_EFFECT_H
#define OB64_COMMON_MUS_EFFECT_H

#include "common/mus_types.h"

typedef struct {
    s16 fc;
    s16 fgain;
    union ALLowPassCoefficients {
        s16 fccoef[16];
        signed long long force_aligned;
    } fcvec;
    s16 *fstate;
    s32 first;
} ALLowPass;

typedef struct {
    u8 pad00[0x14];
    s16 *state;
    f32 ratio;
    s32 upitch;
    f32 delta;
    s32 first;
    u8 pad28[0xC];
} ALResampler;

typedef struct {
    u32 input;
    u32 output;
    s16 ffcoef;
    s16 fbcoef;
    s16 gain;
    f32 rsinc;
    f32 rsval;
    s32 rsdelta;
    f32 rsgain;
    ALLowPass *lp;
    ALResampler *rs;
} ALDelay;

typedef struct {
    u8 filter[0x14];
    s16 *base;
    s16 *input;
    u32 length;
    ALDelay *delay;
    u8 section_count;
    void *paramHdl;
} ALFx;

#endif
