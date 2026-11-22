#include "common/mus_effect.h"
typedef signed long long s64;

typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

u32 osVirtualToPhysical(void *addr);
Acmd *func_000180a0(ALFx *r, s16 *curr_ptr, s32 buff, s32 count, Acmd *p);
Acmd *func_000180a0(ALFx *r, s16 *curr_ptr, s32 buff, s32 count, Acmd *p) {
    Acmd *ptr = p;
    s32 after_end, before_end;
    s16 *updated_ptr, *delay_end;
    delay_end = &r->base[r->length];
    if (curr_ptr < r->base) {
        curr_ptr += r->length;
    }
    updated_ptr = curr_ptr + count;
    if (updated_ptr > delay_end) {
        after_end = updated_ptr - delay_end;
        before_end = delay_end - curr_ptr;
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(4) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(before_end << 1) & ((0x01 << (12)) - 1)) << (12))) | ((u32)(((u32)(buff) & ((0x01 << (12)) - 1)) << (0))); _a->w1 = (u32)(osVirtualToPhysical(curr_ptr)); };
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(4) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(after_end << 1) & ((0x01 << (12)) - 1)) << (12))) | ((u32)(((u32)(buff + (before_end << 1)) & ((0x01 << (12)) - 1)) << (0))); _a->w1 = (u32)(osVirtualToPhysical(r->base)); };
    } else {
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(4) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(count << 1) & ((0x01 << (12)) - 1)) << (12))) | ((u32)(((u32)(buff) & ((0x01 << (12)) - 1)) << (0))); _a->w1 = (u32)(osVirtualToPhysical(curr_ptr)); };
    }
    return ptr;
}
