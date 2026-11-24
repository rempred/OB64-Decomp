typedef unsigned char u8;
typedef signed char s8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
extern u8 *D_80196AF8;
u8 *D_801CC410(s32 id);
extern void func_000ae30c(u16, u16, u16);
extern u8 D_801939D8;
typedef struct {
    u16 id[17];
} WinIdList;
extern WinIdList D_801EFB20;
void D_801CC4A0(u8 *w);
void func_000ae384(void);
void func_000b876c(s16 a, s16 b, s8 f);
void func_000ba790(s32 *p);
void func_000bc7e4(s32 clear, s32 set);
void func_000bc828(s32 clear, s32 set);
void func_000bc86c(s32 clear, s32 set);
typedef struct {
    s16 x;
    s16 y;
} Pair16;
typedef struct {
    f32 x;
    f32 y;
} PairF;
void func_000b4bb8(void) {
    WinIdList ids;
    s32 i;
    u8 *w;
    u16 *p;
    D_801939D8 = 0;
    D_80196AF8[0x9E] = 1;
    (*(s16 *)((u8 *)(D_80196AF8) + (0xA4))) = 0;
    D_80196AF8[0xA2] = 0;
    func_000b876c(0, 0, 0);
    D_80196AF8[0x1E22] = 0;
    D_80196AF8[0x97] = 0;
    D_80196AF8[0x9C] = 0;
    D_80196AF8[0x99] = 0;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x190))) = 0x1E;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x19C))) = 0xFD;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x1A8))) = 0;
    ((PairF *)(D_80196AF8 + 0x5F0))->x = ((PairF *)(D_80196AF8 + 0x5F0))->y = 0.0f;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x136))) = 0xE;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x156))) = 0;
    ((PairF *)(D_80196AF8 + 0x5F0))->x = ((PairF *)(D_80196AF8 + 0x5F0))->y = 0.0f;
    ids = D_801EFB20;
    for (i = 0; i < 10; i++) {
        w = D_80196AF8 + 0x650 + i * 0x108;
        p = ids.id;
        if (w != ((void *)0)) {
            for (; *p != 0xFFFF; p++) {
                if (*p == (*(u16 *)((u8 *)(w) + (0xEE)))) {
                    D_801CC4A0(w);
                    break;
                }
            }
        }
    }
    if (D_80196AF8[0xA1] != 1) {
        w = D_801CC410(0x400);
        if (w != ((void *)0)) {
            D_801CC4A0(w);
        }
        w = D_801CC410(3);
        if (w != ((void *)0)) {
            D_801CC4A0(w);
        }
        w = D_801CC410(5);
        if (w != ((void *)0)) {
            D_801CC4A0(w);
        }
    }
    for (i = 0; i < 5; i++) {
        (D_80196AF8 + i)[0x92] = i;
    }
    func_000ba790((s32 *)(D_80196AF8 + 0x134));
    func_000bc7e4(0x83, 0);
    func_000bc828(0x80, 0);
    func_000bc86c(0x80, 0);
    D_80196AF8[0x9A] = 0;
    D_80196AF8[0x1872] = 0;
    D_80196AF8[0x14D] = 0;
    D_80196AF8[0x609] = 0;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x130))) = 1;
    if (!(D_80196AF8[0xA0] & 2)) {
        (*(s16 *)((u8 *)(D_80196AF8) + (0x1BCC))) = 1;
    }
    D_80196AF8[0x10A9] = 0;
    ((Pair16 *)(D_80196AF8 + 0x10C4))->x = 0;
    D_80196AF8[0x10B9] = 0;
    ((Pair16 *)(D_80196AF8 + 0x10C4))->y = 0;
    D_80196AF8[0x10A8] = D_80196AF8[0x10B8] = 0;
    ((PairF *)(D_80196AF8 + 0x5F0))->x = ((PairF *)(D_80196AF8 + 0x5F0))->y = 0.0f;
    D_80196AF8[0x60B] = 0;
    (*(s32 *)((u8 *)(D_80196AF8) + (0x128))) = 0;
    func_000ae384();
    func_000ae30c(0xA, 0, 0);
}
void func_000b876c(s16 a, s16 b, s8 f);
