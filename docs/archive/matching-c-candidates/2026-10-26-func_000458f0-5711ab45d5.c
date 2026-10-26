int func_000458f0(int itemId)
{
    int type = ((unsigned char *)0x8018C410)[(itemId & 0xFFFF) * 32];

    return type != 0 && (type < 14 || type == 24);
}
