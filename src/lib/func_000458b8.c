/* Extract the equipped item's luck growth bonus. */
int func_000458b8(int equipment_id) {
    return (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDB))) & 3;
}
