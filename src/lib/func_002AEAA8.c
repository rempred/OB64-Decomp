typedef unsigned char u8;
typedef signed short s16;
typedef float f32;
typedef struct {
    s16 v[10];
} Offs2AE;
extern Offs2AE D_80243C40;
f32 D_8022F280(f32 y);
void func_002AEAA8(u8 *o, f32 d) {
    Offs2AE t = D_80243C40;
    D_8022F280(t.v[o[0x13F]] + (*(f32 *)((u8 *)(o) + (0x12C))) + d);
}
