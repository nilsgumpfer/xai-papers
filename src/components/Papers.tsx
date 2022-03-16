import { Table, Row } from "antd"
import { useFilteredPapers } from "../hooks"
import {TagList} from "../components"
import { Paper } from "../types"
import { getColor, typeArray } from "../utils"

const columns = [
	{
		title: "Title",
		dataIndex: "Title",
		render: (text: string, row: Paper) => <a href={row.url} target="_blank" rel="noreferrer">{text}</a>,
		key: "title",
	},
	{
		title: "Venue",
		dataIndex: "Venue",
		key: "venue",
	},
	{
		title: "Year",
		dataIndex: "Year",
		key: "year",
	},
	{
		title: "Author",
		key: "author",
		dataIndex: "Author",
	},
]

function Tag({ record, type }: { record: Paper, type: keyof Paper}) {

	return (
		<TagList TagData={record[type] as string[]} Color={getColor(type)}></TagList>
	)
}

function Papers(): JSX.Element {

	const filteredPapers = useFilteredPapers()

	const papersData = filteredPapers.map((paper) => ({
		...paper,
		key: filteredPapers.indexOf(paper),
		Author: [paper.Authors[0] + " et al."],
	}))

	const sortedPapers = papersData.sort((a, b) => {
		let val = a.Year.localeCompare(b.Year)

		if (val === 0 ) {
			val = a.Venue.localeCompare(b.Venue)
		}

		if (val === 0) {
			val = a.Title.localeCompare(b.Title)
		}

		return val
	})

	return (
		<Table
			style={{ marginTop: 10 }}
			columns={columns}
			dataSource={sortedPapers}
			expandable={{
				expandedRowRender: (record) => (
					<>
						<Row>
							Authors: {record.Authors.map((author) => { 
								return record.Authors.indexOf(author) !== record.Authors.length - 1 
									? author + ", "
									: author 
							})}
						</Row>
						<Row>
							{typeArray.map((type) => (
								<Tag record={record} type={type} key={typeArray.indexOf(type)}/>
							))}
						</Row>
					</>
				),
			}}
		></Table>
	)
}

export default Papers