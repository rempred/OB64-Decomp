typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern u8 *D_801B81B0;
typedef struct {
    void (*cb)(void);
    u8 *obj;
    s32 kind;
    s16 rate;
    u8 padE[2];
    s32 tblA;
    s32 tblB;
    void *anim;
    u8 pad1C[8];
} AnimSlot1D4;
typedef struct {
    u8 pad0[0x44];
    u32 *set;
    u8 *obj;
    AnimSlot1D4 **slot;
    void *buf;
    s32 frame;
} Anim1D4;
void func_001D54E8(void) {
    s32 i;
    u32 j;
    for (i = 0; i < (*(s32 *)((u8 *)(D_801B81B0) + (0x810))); i++) {
        Anim1D4 *a = (*(Anim1D4 * *)((u8 *)(D_801B81B0 + i * 4) + (0x798)));
        f32 z = (*(f32 *)((u8 *)(a) + (0x40)));
        if (z == 17.0f) {
            continue;
        }
        if (z == 19.0f) {
            continue;
        }
        if (z == 20.0f) {
            continue;
        }
        for (j = 0; j < a->set[1]; j++) {
            AnimSlot1D4 *s = a->slot[j];
            if (s != ((void *)0) && !(a->frame > (s32)a->set[0])) {
                ((s32 (*)(AnimSlot1D4 *))s->cb)(s);
            }
        }
    }
    for (i = 0; i < (*(s32 *)((u8 *)(D_801B81B0) + (0x810))); i++) {
        Anim1D4 *a = (*(Anim1D4 * *)((u8 *)(D_801B81B0 + i * 4) + (0x798)));
        f32 z = (*(f32 *)((u8 *)(a) + (0x40)));
        if (z == 17.0f) {
            continue;
        }
        if (z == 18.0f) {
            continue;
        }
        if (z == 14.0f) {
            continue;
        }
        if (z == 15.0f) {
            continue;
        }
        if (z == 16.0f) {
            continue;
        }
        for (j = 0; j < a->set[1]; j++) {
            AnimSlot1D4 *s = a->slot[j];
            if (s != ((void *)0) && !(a->frame > (s32)a->set[0])) {
                ((s32 (*)(AnimSlot1D4 *))s->cb)(s);
            }
        }
    }
}
