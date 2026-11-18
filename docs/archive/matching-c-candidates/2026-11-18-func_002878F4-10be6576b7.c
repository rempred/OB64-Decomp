#include "common/types.h"

typedef struct CompanionImage {
    u8 pad00[3];
    u8 field03;
    u16 width;
    u16 height;
} CompanionImage;

extern CompanionImage *D_8023E580;
extern void *D_8023E584;
extern CompanionImage *D_8023E588;
extern s32 D_8023E58C;
extern s32 D_8023E590;

extern void *func_0002dfb8(void *buffer, u32 key);
extern void *func_0002e138(u32 key);
extern s32 resource_free(u8 *buffer);
extern void *func_00070F30(s32 size);
extern void memcpy_aligned(void *destination, const void *source, s32 count);
extern s32 func_0028ac88(u8 field03, u16 width);

void func_002878F4(void)
{
    u32 *keys = func_0002dfb8(0, 0x01890C90);
    CompanionImage *image;
    s32 rowBytes;
    s32 payloadBytes;
    u8 *buffer;

    D_8023E588 = func_0002e138(keys[17]);
    D_8023E584 = func_0002e138(keys[18]);
    D_8023E580 = func_0002e138(keys[19]);
    resource_free((u8 *)keys);

    image = D_8023E584;
    rowBytes = func_0028ac88(image->field03, image->width);
    payloadBytes = rowBytes * ((CompanionImage *)D_8023E584)->height;
    buffer = func_00070F30(payloadBytes * 2);
    memcpy_aligned(buffer, (u8 *)D_8023E584 + 8, payloadBytes);
    memcpy_aligned(buffer + payloadBytes, (u8 *)D_8023E584 + 8, payloadBytes);

    resource_free(D_8023E584);
    D_8023E584 = buffer;
    D_8023E58C = 0;
    D_8023E590 = 160;
}
