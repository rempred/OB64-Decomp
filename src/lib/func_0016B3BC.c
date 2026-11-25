typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef struct {
    u8 b[6];
} Arg167;
extern u8 D_80214A60;
extern u8 D_8021EEF8;
extern u8 D_8021EEF9;
extern u8 D_8021EEFA;
extern u8 D_8021EEFB;
s32 func_0000735C(s32 a, void *fn, s32 b, s32 c, s32 d, s32 e, s32 f);
void func_0016BA08(s16 k);
void func_0016B3BC(Arg167 s, s32 c) {
    D_80214A60 = 0;
    D_8021EEF8 = c;
    D_8021EEF9 = s.b[2];
    D_8021EEFA = s.b[3];
    D_8021EEFB = s.b[4];
    func_0000735C(0xC000, func_0016BA08, 10, 10, 20, 20, 200);
}
