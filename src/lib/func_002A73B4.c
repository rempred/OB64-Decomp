typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void func_002A73B4(u16 msg, u8 *ctx);
extern u8 D_8020F390[];
extern s32 D_80239130[2];
void func_002A73B4(u16 msg, u8 *ctx) {
    u32 i;
    u8 *o;
    switch (msg) {
        case 0:
            for (i = 0; i < 2; i++) {
                (*(void * *)((u8 *)((*(u8 ** *)((u8 *)(ctx) + (0x58)))[D_80239130[i]]) + (0))) = D_8020F390;
                {
                    u8 *p = (*(u8 ** *)((u8 *)(ctx) + (0x58)))[D_80239130[i]];
                    (*(u16 *)((u8 *)(p) + (0x30))) = 0;
                    (*(u16 *)((u8 *)(p) + (0x32))) = 0;
                    (*(s16 *)((u8 *)(p) + (0x38))) = 0;
                    (*(s16 *)((u8 *)(p) + (0x34))) = (*(u16 *)((u8 *)(p) + (0x30))) + 15;
                    (*(s16 *)((u8 *)(p) + (0x36))) = (*(u16 *)((u8 *)(p) + (0x32))) + 15;
                }
            }
            break;
        case 1:
            break;
        case 2:
            for (i = 0; i < 2; i++) {
                o = (*(u8 ** *)((u8 *)(ctx) + (0x58)))[D_80239130[i]];
                (*(u16 *)((u8 *)(o) + (0x38))) = ((*(u16 *)((u8 *)(o) + (0x38))) + 1) & 1;
                if ((*(u16 *)((u8 *)(o) + (0x38))) != 0) {
                    (*(s16 *)((u8 *)(o) + (0x34))) = (*(s16 *)((u8 *)(o) + (0x30)))-- + 14;
                }
            }
            break;
    }
}
