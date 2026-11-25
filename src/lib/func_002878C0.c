typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk0[4];
    u16 w;
    u16 h;
} SizeCE;
void func_0028752C(SizeCE *s, s32 a, s32 b, s32 c, s32 d, s32 e, s32 f);
void func_0028752C(SizeCE *img, s32 s, s32 t, s32 w, s32 h, s32 x, s32 y);
void func_002878C0(SizeCE *s, s32 a, s32 b) {
    func_0028752C(s, 0, 0, s->w, s->h, a, b);
}
