typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
typedef struct {
    u32 count;
    u8 unk004[0x408];
    void *frames[0x20];
} SpriteEntry;
typedef struct {
    u32 count;
    SpriteEntry entries[1];
} SpriteTable;
typedef struct {
    u32 id;
    u32 handle;
    u32 *p08;
    u32 kind;
    u32 unk10;
    u32 unk14;
    u32 count;
    u32 unk1C;
    u32 unk20;
    u32 unk24;
    u8 *p28;
    u8 *p2C;
    u8 unk30[4];
    void **parts;
    u8 *p38;
    u8 *p3C;
    void *p40;
    void *p44;
    u8 *p48;
    u8 *p4C;
    void *p50;
} Model6E;
void bzero(void *, s32);
Model6E *func_0006fe44(Model6E *out, s32 a, s32 b, s32 c, s32 d, s32 e);
s32 func_0006fa94(SpriteEntry *dst, Model6E *m, s32 a, s32 b, s32 c, s32 d, s32 e, s32 f, s32 g);
void D_80199E00(SpriteTable *t);
extern inline void FreeModel6E(Model6E *m) {
    u32 i;
    for (i = 0; i < m->count; i++) {
        func_000016C4(m->parts[i]);
    }
    func_000016C4(m->p08);
    func_000016C4(m->p44);
    func_000016C4(m->p40);
    func_000016C4(m->p50);
    func_000016C4(m->p28);
}
SpriteTable *func_00070114(s32 a, s32 b, s32 c, s32 d, s32 e, s32 f) {
    Model6E tmp;
    Model6E *m = func_0006fe44(&tmp, a, b, c, d, e);
    SpriteTable *t;
    if (m == ((void *)0)) {
        return ((void *)0);
    }
    t = func_00001330(0xDA8);
    bzero(t, 0xDA8);
    if (func_0006fa94(t->entries, m, a, b, c, d, e, f, 0) == 0) {
        D_80199E00(t);
        FreeModel6E(m);
        return ((void *)0);
    }
    t->count = 1;
    FreeModel6E(m);
    return t;
}
void D_80199E00(SpriteTable *t);
