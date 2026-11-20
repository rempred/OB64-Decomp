typedef signed int s32;
extern s32 e09_byte_80220F68;
extern s32 e09_pointer_80220F6C;
extern s32 e09_u16_80220F70;
extern void *D_80239110[];
void D_8020DD60(void *fn, s32 a);
void func_002A7010(s32 i, s32 a, s32 b, s32 c)
{
  void **new_var;
  e09_byte_80220F68 = a;
  new_var = &D_80239110[i];
  e09_pointer_80220F6C = b;
  e09_u16_80220F70 = c;
  D_8020DD60(*new_var, 0);
}
