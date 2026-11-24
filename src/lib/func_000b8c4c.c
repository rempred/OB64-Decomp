typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
s32 func_000b93d4(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
int D_8016FEF4(signed short);
void D_801B10FC();
void D_801B1624();
void D_801B18FC();
u8 func_000bbad0(void);
extern u8 D_801936E0;
void func_000b8c4c(void)
{
  s16 option;
  s32 x;
  option = func_000bbad0() & 0xFF;
  x = 0xE8;
  if (option)
  {
    x = 0x128;
  }
  func_000b93d4(0x15U, 0xAU, D_801B10FC, 0x60, -8, 0xE0, 0, 0x18, 0x18, (s16) x, 0x34);
  func_000b93d4(6U, 0xAU, D_801B1624, 0x18, 0xD8, 0x20, 0xE0, 0x18, 0xC8, 0x6E, 0xE0);
  if ((D_801936E0 != 0) || (D_8016FEF4(0xB) != 0))
  {
    func_000b93d4(0x10U, 8U, D_801B18FC, 0x128, 0xF0, 0x124, 0xF4, 0x114, 0xC8, 0x128, 0xE0);
  }
}
