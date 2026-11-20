typedef signed char s8;
typedef unsigned char u8;
extern u8 *D_80213778;
extern u8 *D_80213778;
void func_00157EE8(void)
{
  u8 *o = D_80213778;
  u8 *new_var;
  s8 v = o[0x5E];
  u8 k = o[0x605 + (v * 10)];
  if (v == 1)
  {
    new_var = &(o + (k * 8))[0x35C];
    o[0x5D8] = *new_var;
  }
  else
  {
    o[0x5D8] = 0;
  }
}
