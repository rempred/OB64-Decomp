typedef signed int s32;
void func_0012DBB4(s32 n, signed char *buf) {
    s32 tens = n / 10;
    s32 ones = n % 10;
    if (tens) {
        *buf = tens + '0';
    } else {
        *buf = ' ';
    }
    buf++;
    *buf = ones + '0';
    buf[1] = 0;
}
