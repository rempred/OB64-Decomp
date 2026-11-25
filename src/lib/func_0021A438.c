typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x11];
    u8 cls;
    u8 baseCls;
    u8 level;
    u8 gender;
    u16 maxHp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 str;
    u16 vit;
    u16 intl;
    u16 men;
    u16 agi;
    u16 dex;
    u8 luck;
    u16 items[4];
    u8 fatigue;
    u8 status;
} Character;
typedef struct {
    Character c;
    u8 pad[4];
} PlayerChar;
extern PlayerChar D_80193BC0_copy[];
extern u8 *D_801CE8BC;
void D_801C88CC(s32 k);
extern signed char D_801E675C[];
extern u32 D_801CE8FC;
s8 * D_8016E1DC(u8 cls, u8 lv);
s32 func_000238B0(signed char *dst, const signed char *fmt, ...);
void D_801AF9B8(signed char *s, s32 k);
void D_801ADB00(u8 *o);
void D_801ADBC0(s32);
typedef struct {
    u8 pad[0x34];
    s16 alpha;
} Spr213;
typedef struct {
    Spr213 *a;
    u8 pad[8];
    Spr213 *b;
} Pair213;
void func_0021A438(void) {
    signed char buf[0x80];
    s32 t = (*(s32 *)((u8 *)(D_801CE8BC) + (0x6048)));
    Pair213 *old = (*(Pair213 * *)((u8 *)(D_801CE8BC) + (0x6050)));
    u8 *u = (*(u8 * *)((u8 *)(D_801CE8BC) + (0x6054)));
    s32 v;
    s32 w;
    if (t == 0) {
        func_000238B0(buf, D_801E675C, &D_80193BC0_copy[u[0xF6]], D_8016E1DC(u[0x4B], u[0x4F]));
        D_801AF9B8(buf, 0);
    } else if (t >= 10) {
        if (t < 50) {
            Pair213 *nw = (Pair213 *)u;
            v = nw->a->alpha + 8;
            if (v >= 0x100) {
                v = 0xFF;
            }
            nw->a->alpha = v;
            v = nw->b->alpha + D_801CE8FC / 30;
            if (D_801CE8FC < v) {
                v = D_801CE8FC;
            }
            nw->b->alpha = v;
            v = old->a->alpha - 8;
            if (v < 0) {
                v = 0;
            }
            old->a->alpha = v;
            w = old->b->alpha - (s32)D_801CE8FC / 30;
            if (w < 0) {
                w = 0;
            }
            old->b->alpha = w;
        } else {
            D_801ADB00((u8 *)old->a);
            D_801ADBC0((u8 *)old->b);
            old->b = ((void *)0);
            old->a = ((void *)0);
            D_801C88CC(7);
            return;
        }
    }
    (*(s32 *)((u8 *)(D_801CE8BC) + (0x6048)))++;
}
