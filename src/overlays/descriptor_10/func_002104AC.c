typedef unsigned char u8;
typedef signed int s32;
void func_002104AC(u8 *dst, u8 *src, s32 n)
{
  dst += n;
  src += n;
  while (0 != (n--))
  {
    *(--dst) = *(--src);
  }
}
