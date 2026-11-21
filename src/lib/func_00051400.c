typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
s32 func_00051400(u8 **pp);
s32 func_00051400(u8 **pp)
{
  short new_var;
  int new_var2;
  u8 *s = *pp;
  s32 n = 0;
  u8 c;
  if ((*s) != 0)
  {
    do
    {
      u8 *t = s + 1;
      *pp = t;
      new_var2 = '0';
      c = s[1];
      new_var = c - new_var2;
      if (((u32) new_var) >= 10)
      {
        break;
      }
      n = ((n * 10) - new_var2) + c;
      s = t;
    }
    while (c != 0);
  }
  return n;
}
