typedef unsigned char u8;
typedef signed int s32;

/* The roster views share the owner-context word at +0x4C. */
s32 func_0020C120(void *row)
{
    s32 ownerContext;
    s32 paired;

    if (row == 0) {
        return 0;
    }
    ownerContext = *(const s32 *)((const u8 *)row + 0x4C);
    /* Keep the null return and the ordinary-context default separate for KMC. */
    paired = 0;
    /* Retail evaluates the first two equality tests before branching. */
    if (((ownerContext == 10) | (ownerContext == 25)) || ownerContext == 123) {
        paired = 1;
    }
    return paired;
}
