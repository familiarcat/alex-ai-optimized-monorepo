import { Command } from '@oclif/core';
export default class Create extends Command {
    static description: string;
    static args: {
        projectName: import("@oclif/core/lib/interfaces/parser.js").Arg<string, Record<string, unknown>>;
    };
    static flags: {
        framework: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        template: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        interactive: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        ai: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        help: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<void>;
    };
    run(): Promise<void>;
}
//# sourceMappingURL=create.d.ts.map