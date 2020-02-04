import { InstructionParser } from './instruction-parser';
import { RegisterNotFoundException } from '../exceptions/register-not-found-exception';
import { Register } from '../../register/models/register';
import config from '../../library/config';

export class RegisterInstructionParser extends InstructionParser
{
    public parse (value: string): string
    {
        const registers = this.registers(this.removeInstructionAlias(value))
            .map(it => {
                if (!this.register(it)) {
                    throw new RegisterNotFoundException(it);
                }

                return this.register(it).binary;
            });

        const opCode = this.instruction(value).opcode;
        const rs = registers[1];
        const rt = registers[2];
        const rd = registers[0];
        const shamt = '00000';
        const funct = '000000';

        return opCode + rs + rt + rd + shamt + funct;
    }

    protected registers (value: string): string[]
    {
        return value.split(',').map(it => it.trim());
    }

    protected removeInstructionAlias (value: string): string
    {
        return value.split(this.instruction(value).alias)[1];
    }

    protected register (value: string): Register
    {
        return config.registers.find(it => it.hasAlias(value));
    }

    public regex (): RegExp
    {
        return /[A-Za-z]+ \$[a-z0-9]+, ?\$[a-z0-9]+, ?\$[a-z0-9]+/g;
    }
}
