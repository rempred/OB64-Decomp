/* Extract the equipped item's vitality growth bonus. */
int func_00045878(int equipment_id) {
    return ((unsigned char) (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDB))) >> 4) & 3;
}
