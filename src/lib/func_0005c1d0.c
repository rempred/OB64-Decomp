typedef unsigned char u8;
extern u8 D_80196AEC;
extern u8 D_8018FE44[];
extern u8 D_8018FE30[];
u8 *func_0005c1d0(void)
{
  u8 v = D_80196AEC;
  if (v & 8)
  {
    return D_8018FE44;
  }
  if (D_8018FE44)
  {
    D_80196AEC = v & 0xDF;
    return D_8018FE30;
  }
  else
  {
    D_80196AEC = v & 0xDF;
    return D_8018FE30;
  }
}
