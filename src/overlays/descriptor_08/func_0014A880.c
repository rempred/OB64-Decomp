typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern void *D_801FDA44;
typedef struct {
    u8 next;
    u8 kind;
    u8 state;
    u8 unk03;
    s32 key;
    u8 data[0x84];
} Rec149;
extern s16 D_801FDA40;
inline Rec149 *func_0014A880(s32 key, u8 kind) {
    s32 i;
    Rec149 *r = ((void *)0);
    Rec149 *e;
    for (i = 0; i < D_801FDA40; i++) {
        e = &((Rec149 *)D_801FDA44)[i];
        if (e->kind == kind && e->key == key) {
            r = e;
            break;
        }
    }
    return r;
}
