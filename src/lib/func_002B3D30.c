void func_002B5044(void *arg0, signed char arg1, signed char arg2, signed short arg3, unsigned short arg4);
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef signed short s16;
typedef signed char s8;
typedef float f32;
void * func_00001330(unsigned int);
extern u8 *D_8022A970;
extern void *D_800E8210;
void guTranslate(void *, f32, f32, f32);
void memcpy_aligned(void *dst, void *src, s32 n);
void func_002B3D30(void) {
    u8 *b = func_00001330(0x25808);
    (*(u8 * *)((u8 *)(D_8022A970) + (0x54))) = b;
    func_002B5044((*(u8 * *)((u8 *)(D_8022A970) + (0x54))), 0, 2, 0x140, 0xF0);
    memcpy_aligned(b + 8, D_800E8210, 0x25800);
}
void guTranslate(void *, f32, f32, f32);
