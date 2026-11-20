typedef unsigned char u8;
typedef signed int s32;
void func_00048a68(u8 a, u8 b);
extern u8 D_80196A81[];
void func_00048a68(u8 n, u8 v)
{
  int new_var;
  s32 i = n - 1;
  s32 s;
  unsigned int new_var2;
  new_var2 = D_80196A81[i / 8];
  if (1)
  {
    s = i & 7;
 dummy_label_803137: ;
  }
  new_var = new_var2 & (~(1 << s));
  D_80196A81[i / 8] = new_var | (v << s);
}
