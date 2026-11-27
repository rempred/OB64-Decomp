typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u16 D_801BA6C0;
extern u16 D_800E79B0;
s32 func_001EBD5C(void);
s16 func_001EB608(void);
s32 func_001EBD5C(void);
s16 func_001EC124(void) {
    u16 v = D_801BA6C0;
    if ((v & 4) && (D_800E79B0 & 0x8000)) {
        D_801BA6C0 = (v & 0xFFFB) | 8;
    }
    func_001EBD5C();
    return func_001EB608() != 0;
}
