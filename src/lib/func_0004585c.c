/* Extract the equipped item's dexterity growth bonus. */
unsigned int func_0004585c(int equipment_id) {
    return (unsigned char) (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDB))) >> 6;
}
