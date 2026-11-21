typedef signed int s32;
typedef float f32;

typedef union {
  f32 value;
  s32 word;
} FloatWord;

extern s32 e09_byte_80220F68;
extern s32 e09_pointer_80220F6C;
extern s32 e09_u16_80220F70;
extern void *D_80239110[];
void *D_8020DD60(void *fn, void *after);
void *func_002A7010(s32 i, f32 a, f32 b, f32 c)
{
  void **new_var;
  FloatWord first;
  FloatWord second;
  FloatWord third;

  /* The effect inputs receive the three argument words unchanged. */
  first.value = a;
  e09_byte_80220F68 = first.word;
  new_var = &D_80239110[i];
  second.value = b;
  e09_pointer_80220F6C = second.word;
  third.value = c;
  e09_u16_80220F70 = third.word;
  return D_8020DD60(*new_var, 0);
}
