typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_8020F390[];
void func_002A7B3C(u16 msg, u8 *ctx);
extern s32 D_80239158[2];
void func_002A7B3C(u16 msg, u8 *ctx) {
    u32 i;
    switch (msg) {
        case 0:
            for (i = 0; i < 2; i++) {
                (*(void * *)((u8 *)((*(u8 ** *)((u8 *)(ctx) + (0x58)))[D_80239158[i]]) + (0))) = D_8020F390;
                {
                    u8 *p = (*(u8 ** *)((u8 *)(ctx) + (0x58)))[D_80239158[i]];
                    (*(u16 *)((u8 *)(p) + (0x30))) = 0;
                    (*(u16 *)((u8 *)(p) + (0x32))) = 0;
                    (*(s16 *)((u8 *)(p) + (0x34))) = (*(u16 *)((u8 *)(p) + (0x30))) + 15;
                    (*(s16 *)((u8 *)(p) + (0x36))) = (*(u16 *)((u8 *)(p) + (0x32))) + 15;
                }
            }
            break;
        case 1:
            break;
        case 2:
            for (i = 0; i < 2; i++) {
                u8 *p = (*(u8 ** *)((u8 *)(ctx) + (0x58)))[D_80239158[i]];
                (*(u16 *)((u8 *)(p) + (0x30)))--;
                (*(u16 *)((u8 *)(p) + (0x32)))++;
                (*(s16 *)((u8 *)(p) + (0x34))) = (*(u16 *)((u8 *)(p) + (0x30))) + 15;
                (*(s16 *)((u8 *)(p) + (0x36))) = (*(u16 *)((u8 *)(p) + (0x32))) + 15;
            }
            break;
    }
}
