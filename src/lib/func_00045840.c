/* Extract the equipped item's agility growth bonus. */
int func_00045840(int equipment_id) {
    return (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDC))) & 3;
}
