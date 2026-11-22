#include "common/mus_effect.h"
#include "common/mus_voice.h"
typedef signed long long s64;

typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

typedef struct {
    u8 pad00[0x34];
    struct {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        N_PVoice **sources;
        ALFx *fx;
        ALFx *fxArr[1];
    } *auxBus;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
} N_ALSynth;
extern N_ALSynth *D_800A9E54;

Acmd *func_00016100(s32 sampleOffset, Acmd *p);
Acmd *func_00017e90(ALFx *r, ALDelay *d, s32 buff, Acmd *p);
Acmd *func_000180a0(ALFx *r, s16 *curr_ptr, s32 buff, s32 count, Acmd *p);
Acmd *func_000181c8(ALFx *r, s16 *curr_ptr, s32 buff, Acmd *p);
Acmd *func_000182e0(ALLowPass *lp, s32 buff, Acmd *p);
Acmd *func_00017990(s32 sampleOffset, Acmd *p) {
    Acmd *ptr = p;
    ALFx *r = D_800A9E54->auxBus->fx;
    s16 i, buff1, buff2, input, output;
    s16 *in_ptr, *out_ptr, *prev_out_ptr = 0;
    ALDelay *d;
    ptr = func_00016100(sampleOffset, p);
    input = 0x7C0;
    output = 0x930;
    buff1 = 0;
    buff2 = 0x170;
    { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(12) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(0xDA83) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(0x7C0) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(input) & ((0x01 << (16)) - 1)) << (0))); };
    { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(12) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(0x5A82) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(0x930) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(input) & ((0x01 << (16)) - 1)) << (0))); };
    ptr = func_000181c8(r, r->input, input, ptr);
    { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(2) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(output) & ((0x01 << (24)) - 1)) << (0))); _a->w1 = (u32)(184 << 1); };
    for (i = 0; i < r->section_count; i++) {
        d = &r->delay[i];
        in_ptr = &r->input[-d->input];
        out_ptr = &r->input[-d->output];
        if (in_ptr == prev_out_ptr) {
            { s16 t = buff2; buff2 = buff1; buff1 = t; };
        } else {
            ptr = func_000180a0(r, in_ptr, buff1, 184, ptr);
        }
        ptr = func_00017e90(r, d, buff2, ptr);
        if (d->ffcoef) {
            { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(12) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)((u16)d->ffcoef) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(buff1) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(buff2) & ((0x01 << (16)) - 1)) << (0))); };
            if (!d->rs && !d->lp) {
                ptr = func_000181c8(r, out_ptr, buff2, ptr);
            }
        }
        if (d->fbcoef) {
            { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(12) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)((u16)d->fbcoef) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(buff2) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(buff1) & ((0x01 << (16)) - 1)) << (0))); };
            ptr = func_000181c8(r, in_ptr, buff1, ptr);
        }
        if (d->lp) {
            ptr = func_000182e0(d->lp, buff2, ptr);
        }
        if (!d->rs) {
            ptr = func_000181c8(r, out_ptr, buff2, ptr);
        }
        if (d->gain) {
            { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(12) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)((u16)d->gain) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(buff2) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(output) & ((0x01 << (16)) - 1)) << (0))); };
        }
        prev_out_ptr = &r->input[d->output];
    }
    r->input += 184;
    if (r->input > &r->base[r->length]) {
        r->input -= r->length;
    }
    { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(10) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(output) & ((0x01 << (24)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(0x7C0) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(184 << 1) & ((0x01 << (16)) - 1)) << (0))); };
    return ptr;
}
Acmd *func_000180a0(ALFx *r, s16 *curr_ptr, s32 buff, s32 count, Acmd *p);
Acmd *func_000181c8(ALFx *r, s16 *curr_ptr, s32 buff, Acmd *p);
Acmd *func_000182e0(ALLowPass *lp, s32 buff, Acmd *p);
