import { getInitials } from "../../utils/helper.js"

function CharAvatar({ fullName, width, height, style }) {
    return (
        <div className={`${width || 'w-20'} ${height || 'h-20'} ${style || ''}
         flex items-center justify-center rounded-full text-gray-900 font-medium
          bg-gray-100 text-[35px]
         }`}>
            {getInitials(fullName || "")}
        </div>
    )
}

export default CharAvatar