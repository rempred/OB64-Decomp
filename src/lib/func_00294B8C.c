#include "game/cutscene_panels.h"
void bzero(void *p, s32 n);
typedef PanelSlot PtrTbl28;
void bzero(void *p, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void bzero(void *p, s32 n);
void func_00294B8C(PanelContent *o, u16 idx, PtrTbl28 *t) {
    u8 *src = ((u8 **)t->field04)[idx];
    s16 n = o->field5F4;
    s32 i;
    bzero(o, 0x500);
    memcpy_aligned(o, src, 0x500);
    for (i = 0; i < n; i++) {
        o->rows[i] = o->text + (((u8 **)t->field04)[idx + i] - ((u8 **)t->field04)[idx]);
    }
}
