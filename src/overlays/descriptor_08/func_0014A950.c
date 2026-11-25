typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
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
extern u8 D_801FDA42;
extern void (*D_801FD1E4[])(Rec149 *e);
void func_0014A950(void) {
    s32 i;
    Rec149 *e;
    Rec149 *f;
    for (i = 0; i < D_801FDA40; i++) {
        e = (Rec149 *)(i * sizeof(Rec149) + (u32)D_801FDA44);
        if (e->kind != 0) {
            D_801FD1E4[e->kind](e);
            f = (Rec149 *)(i * sizeof(Rec149) + (u32)D_801FDA44);
            if (f->state == 1) {
                f->next = D_801FDA42;
                D_801FDA42 = f - (Rec149 *)D_801FDA44;
                f->kind = 0;
                f->state = 0;
            }
        }
    }
}
