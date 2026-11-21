typedef unsigned char u8;
typedef signed int s32;
void func_00048af0(u8 a, u8 b);
extern u8 D_80196A93[];
void func_00048af0(u8 n, u8 v)
{
  int new_var;
  s32 i = n - 1;
  new_var = D_80196A93[i / 8] & (~(1 << (i & 7)));
  D_80196A93[i / 8] = new_var | (v << ((n - 1) & 7));
}
