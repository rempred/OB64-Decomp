typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
s32 D_801C8FE8(u32);
s16 D_801F70E0(u8 k);
s32 D_801F71CC(u8 k);
s32 func_00279A58(void *);
s32 func_002799B8(u8 k) {
    s16 r = D_801F70E0(k);
    if (r == 0xFF) {
        return -1;
    }
    switch (r) {
        case 0:
            return func_00279A58((u8 *)D_801C8FE8(k));
        case 1:
            return D_801F71CC(k);
        case 2:
            return D_801F71CC(k);
        default:
            return -1;
    }
}
s32 func_00279A58(void *);
