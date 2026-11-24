/* Extract the equipped item's intelligence growth bonus. */
int func_00045820(int equipment_id) {
    return ((unsigned char) (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDC))) >> 2) & 3;
}
