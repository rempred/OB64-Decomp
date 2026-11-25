typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000ad6e0(s32 i, s32 k, u8 both);
void func_000ada30(s32 k, s32 a) {
    u8 *b = D_80196AF8;
    s32 o = k * 0x5C;
    (*(s32 *)((u8 *)(b) + (0x78))) = (*(s32 *)((u8 *)(b + o) + (0x1B08)));
    func_000ad6e0(k, a, 1);
}
