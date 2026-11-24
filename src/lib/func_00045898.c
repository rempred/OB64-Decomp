/* Extract the equipped item's mentality growth bonus. */
int func_00045898(int equipment_id) {
    return ((unsigned char) (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDB))) >> 2) & 3;
}
