typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
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
} Key2A3;
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
} KeyOut2A3;
u8 *func_002A2610(s32 a, s32 id);
s32 func_002A3030(s32 owner, s32 anim, u32 k, s32 id, KeyOut2A3 *out) {
    u8 *tab = func_002A2610(owner, id);
    u16 *a;
    Key2A3 *key;
    if (tab != ((void *)0)) {
        a = (u16 *)(tab + ((s32 *)tab)[anim]);
    } else {
        a = ((void *)0);
    }
    if (k < *a++) {
        a = (u16 *)((Key2A3 *)a + k);
        key = (Key2A3 *)a;
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
