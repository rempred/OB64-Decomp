typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
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
extern Character D_80195560_copy[];
extern s8 (*D_80213054[])(u16 v);
u16 func_00152CD8(u8 side, u8 idx, u8 slot);
void func_00152C6C(u8 enemy, u8 idx, u8 *cls, u8 *base);
void func_00152C6C(u8 enemy, u8 idx, u8 *cls, u8 *base);
u16 func_00152CD8(u8 side, u8 idx, u8 slot);
typedef struct {
    f32 v[3];
} Mult151;
extern inline s16 ItemBonus151(u8 side, u8 idx, u8 k) {
    u8 cls;
    u8 base;
    s16 sum = 0;
    s32 i;
    func_00152C6C(side, idx, &cls, &base);
    for (i = 1; i < 5; i++) {
        sum += (s8)D_80213054[k](func_00152CD8(side, idx, i));
    }
    return sum;
}
extern Mult151 D_80214CD0;
unsigned char D_8016D350(int, int);
u16 func_001535A4(u8 side, u8 n, u8 kind) {
    Mult151 m = D_80214CD0;
    Character *c;
    u8 idx;
    u8 cls;
    u8 base;
    f32 intl;
    f32 men;
    f32 bonus;
    u16 r;
    idx = n < 100 ? n : 0;
    if (side == 0) {
        c = &D_80193BC0_copy[idx].c;
    } else {
        c = &D_80195560_copy[idx];
    }
    cls = c->cls;
    base = c->baseCls;
    intl = c->intl;
    men = c->men + ItemBonus151(side, idx, 3);
    bonus = ItemBonus151(side, idx, 2);
    r = ((unsigned char)D_8016D350((unsigned char)(cls),(unsigned char)(base)) + bonus) / 20.0f * (intl + 50.0f) / 50.0f * (men + 100.0f) / 100.0f;
    return r * m.v[kind];
}
