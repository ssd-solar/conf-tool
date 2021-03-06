'use strict'

const { flags } = require('@oclif/command')

const str2primitive = [
  {
    match: v => v === 'true',
    parse: v => true
  },
  {
    match: v => v === 'false',
    parse: v => false
  },
  {
    match: v => v === 'null',
    parse: v => null
  },
  {
    match: v => v.match(/^\d+(([.,]\d)+)$/mi),
    parse: v => parseFloat(v, 10)
  },
  {
    match: v => v.startsWith('pkgs.') || v.startsWith('let '),
    parse: v => ({ _literal: true, _value: v })
  }
]

module.exports = {
  id: 'keys',
  convertToKeys: keys => keys,
  default: {},
  cmds: {
    'set-key': {
      args: [
        {
          name: 'key', // name of arg to show in help and reference with args[name]
          required: true, // make the arg required with `required: true`
          description: 'Key whoose value to change' // help description
        },
        {
          name: 'value', // name of arg to show in help and reference with args[name]
          required: true, // make the arg required with `required: true`
          description: 'Value to be set (use --json to set a JSON value)' // help description
        }
      ],
      description: 'Set a key',
      flags: {
        json: flags.boolean({
          char: 'j',
          default: false
        }),
        literal: flags.boolean({
          char: 'l',
          default: false
        })
      },
      run: (flags, args, db) => {
        let { key: k, value: v } = args

        if (flags.json) {
          return db.set(k, JSON.parse(v))
        }

        if (flags.literal) {
          return db.set(k, { _literal: true, _value: v })
        }

        for (let i = 0; i < str2primitive.length; i++) {
          const prim = str2primitive[i]

          if (prim.match(v)) {
            v = prim.parse(v)
            break
          }
        }

        return db.set(k, v)
      }
    },
    'del-key': {
      args: [
        {
          name: 'key', // name of arg to show in help and reference with args[name]
          required: true, // make the arg required with `required: true`
          description: 'Key whoose value to recursivly delete (be careful!)' // help description
        }
      ],
      description: 'Delete a key',
      run: (flags, args, db) => {
        // TODO: cleanup branches with no leaves
        return db.del(args.key)
      }
    },
    'get-key': {
      args: [
        {
          name: 'key', // name of arg to show in help and reference with args[name]
          required: true, // make the arg required with `required: true`
          description: 'Key whoose value to display' // help description
        }
      ],
      description: 'Get the value of a key',
      run: (flags, args, db) => {
        console.log(require('util').inspect(db.get(args.key), { colors: true, depth: null })) // eslint-disable-line no-console
      }
    }
  }
}
