typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000b85b4(void)
{
  u8 *st = D_80196AF8;
  long new_var;
  u8 *p = st + 0x1164;
  s32 i;
  st[0x1167] = 1;
  st[0x1169] = 0;
  st[0x1168] = 0;
  st[0x116D] = 0xFF;
  st[0x116B] = 0;
  new_var = 0xFF;
  st[0x116C] = 0;
  for (i = 4; i >= 0; i--)
  {
    p[2] = new_var;
    p--;
  }
}
