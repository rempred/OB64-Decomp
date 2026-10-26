int func_00045a50(unsigned short item0, unsigned short item1,
                  unsigned short item2, unsigned short item3)
{
    if (*(unsigned char *)((signed char *)(item0 * 32 + 0x80190000) - 0x3BF0) == 23) {
        return item0;
    }

    if (*(unsigned char *)((signed char *)(item1 * 32 + 0x80190000) - 0x3BF0) == 23) {
        return item1;
    }

    if (*(unsigned char *)((signed char *)(item2 * 32 + 0x80190000) - 0x3BF0) == 23) {
        return item2;
    }

    return *(unsigned char *)((signed char *)(item3 * 32 + 0x80190000) - 0x3BF0) == 23 ? item3 : 0;
}
