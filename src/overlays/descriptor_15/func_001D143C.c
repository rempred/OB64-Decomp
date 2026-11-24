typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
extern void *D_801BA6F8;
typedef struct {
    s32 id;
    u8 unk04[4];
    void *p08;
    u8 unk0C[0xC];
    u32 count;
    u8 unk1C[0xC];
    void *p28;
    u8 unk2C[8];
    void **parts;
    void *p38;
    void *p3C;
    u8 unk40[0x18];
    void *p58;
} Ent1CE;
typedef signed short s16;
typedef unsigned short u16;
typedef float f32;
typedef struct {
    u16 a;
    s16 b;
    s16 c;
    u16 d;
    u16 e;
    u16 f;
    u16 sx;
    u16 sy;
} Key1CE;
typedef struct {
    s32 a;
    s32 b;
    s32 c;
    s32 d;
    s32 e;
    s32 f;
    f32 sx;
    f32 sy;
    u8 index;
} KeyOut1CE;
static s32 func_001D1554(s32 id, s32 anim, u32 k, KeyOut1CE *out);
void func_001D143C(void) {
    u32 i, j;
    if (D_801BA6F8 != ((void *)0)) {
        for (i = 0; i < 10; i++) {
            for (j = 0; j < ((Ent1CE *)D_801BA6F8)[i].count; j++) {
                if (((Ent1CE *)D_801BA6F8)[i].parts[j] != ((void *)0)) {
                    func_000016C4(((Ent1CE *)D_801BA6F8)[i].parts[j]);
                }
            }
            func_000016C4(((Ent1CE *)D_801BA6F8)[i].p08);
            func_000016C4(((Ent1CE *)D_801BA6F8)[i].p3C);
            func_000016C4(((Ent1CE *)D_801BA6F8)[i].p38);
            func_000016C4(((Ent1CE *)D_801BA6F8)[i].p58);
            func_000016C4(((Ent1CE *)D_801BA6F8)[i].p28);
        }
        func_000016C4(D_801BA6F8);
        D_801BA6F8 = ((void *)0);
    }
}
static s32 func_001D1554(s32 id, s32 anim, u32 k, KeyOut1CE *out) {
    Ent1CE *e = D_801BA6F8;
    s32 n = 9;
    u8 *tab;
    u16 *a;
    Key1CE *key;
    do {
        if (e->id != 0 && e->id == id) {
            tab = e->p3C;
            goto found;
        }
        e++;
    } while (n--);
    tab = ((void *)0);
found:
    if (tab != ((void *)0)) {
        a = (u16 *)(tab + ((s32 *)tab)[anim]);
    } else {
        a = ((void *)0);
    }
    if (k < *a++) {
        a = (u16 *)((Key1CE *)a + k);
        key = (Key1CE *)a;
        out->index = k;
        out->a = key->a;
        out->b = key->b;
        out->c = key->c;
        out->d = key->d;
        out->e = key->e;
        out->f = key->f;
        out->sx = (key->sx >> 10) + (key->sx & 0x3FF) / 1024.0f;
        out->sy = (key->sy >> 10) + (key->sy & 0x3FF) / 1024.0f;
        return 1;
    }
    return 0;
}
