int register_asm(void)
{
    register int value asm("$2");
    return value;
}
