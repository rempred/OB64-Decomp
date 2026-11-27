typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 D_801951B0[][0x24];
typedef struct {
    u8 pad[0x1C];
    u16 flags;
    u16 pad1E;
    u16 size;
    u16 pad22;
} Loc127;
extern s32 D_801F1070;
s32 func_00127BFC(void) {
    s32 i;
    s32 sum = 0;
    for (i = 0; i < D_801F1070; i++) {
        if (((Loc127 *)D_801951B0)[i].flags & 2) {
            sum += ((Loc127 *)D_801951B0)[i].size;
        }
    }
    return sum;
}
